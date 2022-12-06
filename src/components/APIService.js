export default class APIService {
  static UpdateReg(id, body) {
    return fetch(`http://127.0.0.1:5000/elimination/update_reg/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  }

  static InsertReg(body) {
    return fetch(`http://127.0.0.1:5000/elimination/add_reg/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  }

  static DeleteReg(id) {
    return fetch(`http://127.0.0.1:5000/elimination/delete_reg/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  static GetTweets(num) {
    return fetch(`http://127.0.0.1:5000/elimination/get_random/${num}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(body),
    })
      .then((resp) => resp.json())
      .catch((error) => console.log(error));
  }
}
