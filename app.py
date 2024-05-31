from flask import Flask, render_template, request, jsonify
import random
import time

app = Flask(__name__)

# Dictionary to store access keys and corresponding messages
access_keys = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/validate', methods=['POST'])
def validate():
    access_key = request.form['access_key']
    if len(access_key) == 4 and access_key.isdigit() and access_key in access_keys:
        if access_keys[access_key]['expiration'] >= time.time():
            message_info = access_keys.pop(access_key)
            return jsonify({'success': True, 'message': message_info['message'], 'disappear_time': message_info['disappear_time']})
        else:
            return jsonify({'success': False, 'message': 'Access key expired'})
    else:
        return jsonify({'success': False, 'message': 'Invalid access key'})

@app.route('/generate_access_key', methods=['POST'])
def generate_access_key():
    message = request.form['message']
    disappear_time = int(request.form['disappear_time'])
    access_key = ''.join(random.choices('0123456789', k=4))
    access_keys[access_key] = {'message': message, 'expiration': time.time() + disappear_time, 'disappear_time': disappear_time}
    return jsonify({'success': True, 'access_key': access_key})

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0')
