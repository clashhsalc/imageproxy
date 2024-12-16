from flask import Flask, request, Response, jsonify
import requests

app = Flask(__name__)

@app.route('/proxy', methods=['GET'])
def proxy():
    image_url = request.args.get('url')
    if not image_url:
        return jsonify({'error': 'URL parameter required'}), 400

    try:
        response = requests.get(image_url, stream=True, allow_redirects=True)
        if response.status_code != 200:
            return jsonify({'error': response.reason}), response.status_code

        content_type = response.headers.get('Content-Type', '')
        if not content_type.startswith('image/'):
            return jsonify({'error': 'URL does not point to an image'}), 400

        headers = {
            'Content-Type': content_type,
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*'
        }
        return Response(response.iter_content(chunk_size=8192), headers=headers)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)