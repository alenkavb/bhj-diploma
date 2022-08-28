/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, resp) => {
      if (resp && resp.success) {
        this.element.reset();
        App.update();
        App.getModal('createAccount').close();
      } else if (err) {
        alert(err.error);
      }
    })
  }
}