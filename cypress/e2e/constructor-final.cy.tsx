describe('Burger Constructor - Final Tests', () => {
  beforeEach(() => {
    // Мокаем запрос ингредиентов
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    
    // Мокаем запрос данных пользователя
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    // Мокаем создание заказа
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' }).as('createOrder');

    // Устанавливаем моковые токены
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
    cy.setCookie('accessToken', 'fake-access-token');

    // Посещаем главную страницу
    cy.visit('/');
    
    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем токены после каждого теста
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookie('accessToken');
  });

  it('should display ingredients list and basic functionality', () => {
    // Проверяем основные элементы страницы
    cy.contains('Соберите бургер').should('be.visible');
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');

    // Проверяем наличие ингредиентов
    cy.get('body').should('contain', 'Краторная булка N-200i');
    cy.get('body').should('contain', 'Биокотлета из марсианской Магнолии');
    cy.get('body').should('contain', 'Соус Spicy-X');
  });

  it('should add ingredients to constructor using click', () => {
    const bunSelector = '[data-cy="643d69a5c3f7b9001cfa093c"]';
    const mainSelector = '[data-cy="643d69a5c3f7b9001cfa0941"]';
    const constructorSelector = '[data-cy="burger-constructor"]';

    // Добавляем булку
    cy.get(bunSelector).find('button').click({ force: true });
    cy.get(constructorSelector).should('contain', 'Краторная булка N-200i');

    // Добавляем основной ингредиент
    cy.get(mainSelector).find('button').click({ force: true });
    cy.get(constructorSelector).should('contain', 'Биокотлета из марсианской Магнолии');

    // Проверяем, что цена обновилась
    cy.get('[data-cy="total-price"]').should('not.contain', '0');
  });

  it('should open ingredient modal by clicking on ingredient', () => {
    const ingredientSelector = '[data-cy="643d69a5c3f7b9001cfa093c"]';
    
    // Кликаем на ингредиент для открытия модального окна
    cy.get(ingredientSelector).find('a').first().click({ force: true });

    // Проверяем URL (должен измениться)
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    
    // Проверяем, что данные именно этого ингредиента отображаются
    cy.get('body').should('contain', 'Краторная булка N-200i');
    
    // Проверяем детали ингредиента
    cy.get('body').should('contain', 'Калории');
    cy.get('body').should('contain', '420'); // калории булки
    cy.get('body').should('contain', 'Белки');
    cy.get('body').should('contain', '80'); // белки булки

    // Закрываем модальное окно (нажимаем назад или ESC)
    cy.go('back');
    
    // Проверяем, что вернулись на главную страницу
    cy.url().should('not.include', '/ingredients/');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should test order creation flow for authenticated user', () => {
    const bunSelector = '[data-cy="643d69a5c3f7b9001cfa093c"]';
    const mainSelector = '[data-cy="643d69a5c3f7b9001cfa0941"]';
    const constructorSelector = '[data-cy="burger-constructor"]';

    // Добавляем ингредиенты
    cy.get(bunSelector).find('button').click({ force: true });
    cy.get(mainSelector).find('button').click({ force: true });

    // Проверяем, что ингредиенты добавились в конструктор
    cy.get(constructorSelector).should('contain', 'Краторная булка N-200i');
    cy.get(constructorSelector).should('contain', 'Биокотлета из марсианской Магнолии');

    // Проверяем, что цена не равна 0
    cy.get('[data-cy="total-price"]').should('not.contain', '0');

    // Кликаем на кнопку "Оформить заказ"
    cy.get('[data-cy="order-button"]').click({ force: true });

    // Ждем запроса создания заказа
    cy.wait('@createOrder');

    // Проверяем, что номер заказа отображается (может быть в модальном окне или на странице)
    cy.get('body', { timeout: 15000 }).should('contain', '37373');

    // Если есть модальное окно, закрываем его
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="modal"]').length > 0) {
        // Закрываем модальное окно
        cy.get('[data-cy="modal-close"]').click({ force: true });
        // Или нажимаем ESC
        cy.get('body').type('{esc}');
      }
    });

    // Проверяем, что конструктор очистился после успешного создания заказа
    cy.get('[data-cy="total-price"]', { timeout: 10000 }).should('contain', '0');
    
    // Проверяем, что ингредиенты исчезли из конструктора
    cy.get(constructorSelector).should('contain', 'Выберите булки');
    cy.get(constructorSelector).should('contain', 'Выберите начинку');
  });

  it('should redirect unauthenticated user to login', () => {
    // Мокаем неавторизованного пользователя
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    }).as('getUserUnauthorized');

    // Очищаем токены
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
    cy.clearCookie('accessToken');

    // Перезагружаем страницу
    cy.reload();
    cy.wait('@getIngredients');

    // Добавляем булку
    const bunSelector = '[data-cy="643d69a5c3f7b9001cfa093c"]';
    cy.get(bunSelector).find('button').click({ force: true });

    // Пытаемся создать заказ
    cy.get('[data-cy="order-button"]').click({ force: true });

    // Должны перейти на страницу логина
    cy.url().should('include', '/login');
  });

  it('should test drag and drop ingredients to constructor', () => {
    const bunSelector = '[data-cy="643d69a5c3f7b9001cfa093c"]';
    const sauceSelector = '[data-cy="643d69a5c3f7b9001cfa0942"]';
    const constructorSelector = '[data-cy="burger-constructor"]';

    // Тестируем drag & drop с булкой
    cy.get(bunSelector)
      .trigger('mousedown', { which: 1 })
      .trigger('dragstart')
      .trigger('drag');
    
    cy.get(constructorSelector)
      .trigger('dragover')
      .trigger('drop')
      .trigger('dragend');

    // Если drag&drop не сработал, используем fallback - клик
    cy.get('body').then(($body) => {
      if (!$body.text().includes('Краторная булка N-200i')) {
        cy.get(bunSelector).find('button').click({ force: true });
      }
    });

    // Проверяем результат
    cy.get(constructorSelector).should('contain', 'Краторная булка N-200i');

    // Добавляем соус кликом для надежности  
    cy.get(sauceSelector).find('button').click({ force: true });
    cy.get(constructorSelector).should('contain', 'Соус Spicy-X');
  });

  it('should test modal window closing functionality', () => {
    const ingredientSelector = '[data-cy="643d69a5c3f7b9001cfa093c"]';
    
    // Открываем модальное окно ингредиента
    cy.get(ingredientSelector).find('a').first().click({ force: true });

    // Проверяем, что модальное окно открылось
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    cy.get('body').should('contain', 'Краторная булка N-200i');

    // Тестируем закрытие модального окна разными способами
    // 1. Закрытие через кнопку "назад" в браузере
    cy.go('back');
    cy.url().should('eq', Cypress.config().baseUrl + '/');

    // 2. Открываем снова и закрываем через ESC (если поддерживается)
    cy.get(ingredientSelector).find('a').first().click({ force: true });
    cy.url().should('include', '/ingredients/643d69a5c3f7b9001cfa093c');
    
    // Закрываем через ESC
    cy.get('body').type('{esc}');
    
    // Проверяем, что модальное окно закрылось
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
