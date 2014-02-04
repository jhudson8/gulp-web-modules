
requireSection('hello', function(data) {
  document.getElementById('message').innerText = 'hello ' + data.name;
});

