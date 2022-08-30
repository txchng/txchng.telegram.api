var axios;

function httpCall(url, params) {
  return new Promise(function(resolve, reject) {
    axios.post(url, params)
      .then((res) => {
        var response = res.data;
        resolve(response);
      })
      .catch((error) => {
        console.log(error);
        console.error(error)
      })
  });
}

module.exports = exports = function(options) {
  axios = options.axios;

  this.httpCall = httpCall;
}
