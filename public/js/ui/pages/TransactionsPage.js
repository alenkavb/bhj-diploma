/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */

  constructor(element) {
    if (typeof (element) === "undefined")
      throw new Error('Невалидное значение');

    this.element = element;
    this.registerEvents();
    this.LastOptions = null;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.LastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector('.remove-account').onclick = (e) => {
      console.log('remove account', this);
      this.removeAccount();
    };

    // this.element.querySelector('.transaction__remove').onclick = (e) => {
    //   this.removeTransaction();
    // }
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.LastOptions)
      return;

    if (confirm('Вы действительно хотите удалить счет?')) {
      Account.remove({ id: this.LastOptions.account_id }, (err, resp) => {
        if (resp && resp.success) {
          App.updateWidgets();
          App.updateForms();
          this.clear();
        }
      })
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (result = confirm('Вы действительно хотите удалить транзакцию?')) {
      Transaction.remove(id)
      App.update();
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options)
      return;

    this.LastOptions = options;
    Account.get(options.account_id, (err, resp) => {
      if (resp && resp.success) {
        this.renderTitle(resp.data.name);
      }
    });

    Transaction.list(options, (err, resp) => {
      // this.LastOptions = options;
      if (resp && resp.success) {
        this.renderTransactions(resp.data);
      }
    })
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector('.content-title').innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let parts = date.split(' ');
    let [year, mon, day] = parts[0].split('-');
    let [hour, min, sec] = parts[1].split(':');

    let dt = new Date();
    dt.setFullYear(year);
    dt.setMonth(mon - 1);
    dt.setDate(day);
    dt.setHours(hour);
    dt.setMinutes(min);
    dt.setSeconds(sec);

    return `${dt.toLocaleDateString('ru-RU', { dateStyle: "long" })} в ${dt.toLocaleTimeString('ru-RU', { timeStyle: "short", })}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `
    <div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
        ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" ${item.id}="12">
          <i class="fa fa-trash"></i>  
        </button>
      </div>
    </div>
    `
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = document.querySelector('.content');
    data.forEach(transaction => {
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(transaction));
    })
  }
}
