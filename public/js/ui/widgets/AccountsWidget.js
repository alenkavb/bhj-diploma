/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (typeof (element) === "undefined")
      throw new Error('Невалидное значение');

    this.element = element;
    // this.registerEvents();
    // TODO: надо ли вызывать это??
    // this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    document.querySelector('.create-account').onclick = (e) => {
      App.getModal('createAccount').open();
    }
    let accountsList = this.element.getElementsByClassName('account');
    console.log('accounts list', accountsList);

    for (let el of this.element.getElementsByClassName('account')) {
      el.onclick = (e) => {
        e.preventDefault();
        this.onSelectAccount(el);
      }
    }
  }


  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    Account.list(null, (err, resp) => {
      if (resp && resp.success) {
        this.clear();
        resp.data.forEach(account => this.renderItem(account));
      }
    })
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('.account').forEach((account) => account.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    const activeAccount = document.getElementsByClassName('active');
    if (activeAccount.length > 0) {
      console.log('remove class active');
      activeAccount[0].classList.remove('active');
    }

    element.classList.add('active');
    App.showPage('transactions', { account_id: element.dataset.id });
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    return `<li class="account" data-id="${item.id}">
              <a href="#">
               <span>${item.name}</span>
               <span>${item.sum}</span>
              </a>
           </li>`
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    // TODO: откуда дублирование вызовов?
    // console.log('---', data);
    this.element.insertAdjacentHTML('beforeend', this.getAccountHTML(data));
    this.registerEvents();
  }
}
