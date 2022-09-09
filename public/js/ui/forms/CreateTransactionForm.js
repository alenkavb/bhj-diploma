/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsListExpence = this.element.getElementById('expense-accounts-list');
    const accountsListIncome = this.element.getElementById('income-accounts-list');
    Account.list(null, (err, resp) => {
      if (resp && resp.success) {
        accountsListExpence.innerHTML = '';
        accountsListIncome.innerHTML = '';
        //this.clear();
        
        for (let elem of resp.data) {
          accountsListExpence.insertAdjacentHTML('beforeend',
            `<option value="${elem.id}">${elem.name}</option>`);

          accountsListIncome.insertAdjacentHTML('beforeend',
            `<option value="${elem.id}">${elem.name}</option>`);
        };
      };
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, resp) => {
      if (resp && resp.success) {
        this.element.reset();
        App.update();
        if (data.type === 'expense') {
          App.getModal('newExpense').close();
        } else if (data.type === 'income') {
          App.getModal('newIncome').close();
        }
      } else if (err) {
        alert(err.error);
      }
    })
  }
}