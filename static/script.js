function generateAccessKey() {
    var message = document.getElementById('message').value;
    var disappearTime = document.getElementById('disappear-time').value;
    if (message && disappearTime) {
        $.post('/generate_access_key', {'message': message, 'disappear_time': disappearTime}, function(data) {
            if (data.success) {
                document.getElementById('access-key').innerText = 'Your access key: ' + data.access_key;
                document.getElementById('copy-button').style.display = 'inline'; // Show the Copy to Clipboard button
                document.getElementById('copy-button').setAttribute('data-key', data.access_key); // Store access key in button attribute
            } else {
                alert('Failed to generate access key');
            }
        });
    } else {
        alert('Please enter both a message and a disappear time.');
    }
}

function copyToClipboard() {
    var accessKey = document.getElementById('copy-button').getAttribute('data-key');
    var tempInput = document.createElement('input');
    tempInput.value = accessKey;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('Access key copied to clipboard');
}

function showMessageByAccessKey() {
    var accessKey = document.getElementById('access-key-input').value;
    if (accessKey) {
        $.post('/validate', {'access_key': accessKey}, function(data) {
            if (data.success) {
                document.getElementById('result').innerText = 'Message: ' + data.message;
                var timeLeft = data.disappear_time; // Custom disappear time
                var timerId = setInterval(function() {
                    if (timeLeft <= 0) {
                        clearInterval(timerId);
                        document.getElementById('result').innerText = '';
                        document.getElementById('timer').innerText = '';
                    } else {
                        document.getElementById('timer').innerText = 'Remaining Time: ' + timeLeft + ' seconds';
                        timeLeft--;
                    }
                }, 1000); // Update every second
            } else {
                alert(data.message);
            }
        });
    }
}
