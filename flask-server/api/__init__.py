from flask import Flask
from firebase_admin import credentials, initialize_app
from flask_cors import CORS

# please replace the following with your own credential
firebaseConfig = {
  "type": "service_account",
  "project_id": "cs584-698ac",
  "private_key_id": "63ef14ac866e589d7e905b2adb007baa57b5b8e2",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0uj+jm2LBNBG0\niREGkGnqhMCEAfk6sNPDfRrw1ku6s7Kw+lGPW8QR0/RaJZ0Rgcdvx/ft9sv1KnJv\nKDJEMDqAc072lyCPvzUb0pj97UmryILii1QlArH8Q70KkGwTekPsQWCZdadE5C5G\nSUcGlgI3pR7mlP/PP7qwng+5oj6shngO67bnw3Jl1w+qyrQVPns9FbDKPXwVaFf4\n7MCZ8yz2SREfZ9F6g3ZTCk3dTXQhT6OdtEpiqA4c8tke+B2C3nX9Sstdn1iOM2M1\nH3IwX8PgpbZpOXWDbDIWD266i8aU0a8pcJSVrkqbACHHWtbCUndWBwZJw6KdzNy5\n62ag42WnAgMBAAECggEAEi5ecpYSND+JvHDBjrh+f0JFn8IXEYlydEskp6/XRHwJ\ncPZtuA9SRTzeayc3iuhUaPFkBsN6NzrC8l3H2MZFTGDNQ89mTi+9JwRjsb/qVmbA\njAvaNjL0Nt2Vqfdnd/on1R+qmSWV4z9VTGrYw1fZ90EcP7Qjm/TcUiJEkLc6uN5O\n14h7reKi3NzFfdB4+M9dQMF0qCvD8uHZK0PspLv3kxsO9yOZB8YOCMCTMmTZpMRR\nnhECX4UMXYlb3wEqN/sV2mlexl/qKKCWsmKZt4X+Lbt1GoLvgyTQ4UGTH+E5W9aD\nepHzKZ8GSZxkwrXv5CDIIHzerwDSxy2odhtX1WLpQQKBgQDnPBf3Z1857HxJvBHY\n5gtiVHL3HdTvlc9sfKz/3xzTCPp7UDJlBAuPc70zEXR2xhM1xzBHPBPTIpkhbNDR\nsyvTlnAVpcquRYPaCbYh/Uc3n09nT12uWgEtcSJSuP3k0cXup8RoHxJ6Br/J8nvi\nBFCenvzshpvZWWbBu20mNJUFhwKBgQDIFV4Wdt25/QnDE0L6vc5Bev5ieldhuPSr\nwy+kb8u9K9YEqKEq8ZeOE+QS9DpfGqA+X7aW6d9yXUI/vSQGnL4EitcXbAJ2dwTA\nxhhF57N8xennlX0cnxifOE29en5DaiHfS3NWnAhYdMX6cY7UC62T3FDDS4DeWe6a\nhJPXygym4QKBgGUhxD2hSWW1B1rcVVXurvXvh2SK+JFcjR6enK8/7oRh/eMm3ROP\nJFs2PH50WOKFmOtBVd0h6m3CSQT0aZP9b+KXfigJnc6Aer1G2BCfjKFIHNtLO+bA\nWJl+TIuveuOz14ScfWsog9U41HLHieT9DCGD2Yy9BraVwjpi9cbq4m5LAoGBAKJ2\n7zowdKQT+jxDRKzTOEplM3AFRTTdeRaLXAEaogXONW78+jkjiNtd/WECnO8icKGV\nGG78Imr7nNKio0EXPxfzIOos0ucch2h8sbL5i/2xutdHxBpceSK4Fi/X6fSVlkF5\nQ4M9GW2yDBvq334AqYYZbB7YDSD/R0aChoW+030hAoGBAJxZhss5pYSRG4Geq4Ym\nyQVh/0JFXv1Ec71eT6crGaazH1JIuQviEM+Q1u5qARDMmgX4ogD5FZnWUcW0D6EE\nwHxJRzehYwVEx5RtVcLQF1LLeqsfww8jinT3SrwQVzSTDm0eSWSKo1MrQUBDMFbP\nDZd25brwztwfSgD3LvGdFiHc\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-9ylnw@cs584-698ac.iam.gserviceaccount.com",
  "client_id": "109472448746734624037",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9ylnw%40cs584-698ac.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}


cred = credentials.Certificate(firebaseConfig)
default_app = initialize_app(cred)



def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["SECRET_KEY"] = '12345dsfghlakhlaklewhaslgbalkgbaweu'

    from .userAPI import userAPI
    app.register_blueprint(userAPI, url_prefix = '/user')

    from .elimination import elimination
    app.register_blueprint(elimination, url_prefix='/elimination')

    from .cluster import cluster
    app.register_blueprint(cluster, url_prefix='/cluster')

    return app