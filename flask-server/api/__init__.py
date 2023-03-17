from flask import Flask
from firebase_admin import credentials, initialize_app
from flask_cors import CORS

# old database
# firebaseConfig = {
#   "type": "service_account",
#   "project_id": "clus-vis",
#   "private_key_id": "42ae022fd1c0b37d23600ba3e894435d48e82b83",
#   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNiUYYyjPXvGv8\nWix3+nW78qBtdhy+Z9YrcwMjIO9928BkUH+MD4X+GWSMVOj1au1P4KckyL2sCgku\n26Zs8d+R2dVmCK725kk7MzzbU3T1qQal4TQLnr/MKwDd9D3akCS1osC7YsaeKNdb\nRhs2gKS4JIP4Bn7A4NnrF9d4cjgu8NCez9cq8/7kOBrozmP2UFFBTIJN9EHZfC3q\nO6ch98OQb3cyF9bhsgNGnzb4NllKqVc5yv9oCLRwbmkoKHLNSXsOf7hqarUvpAXx\nObqbbhrn8WxfLU4KXS2w0AhcHaGuIDejmL9JYgkIJZiPyYDNBwAzIFdsdV1uQxN7\nNC/1eU4fAgMBAAECggEAB65wXd51FQhM2m1EBiu5qAs+Jn96hke5Mxjfp4OdSJ9c\njOH+VuoHKggGxPb2wOfRgu98vF2IrbjKg5iE98F7+LzYMA/YlXdgeHrXZ3yoCsBM\n2ncJp0SX9DGBSPDjsOQrZqnM+/gbmQnUzK28j417yXw+puXAJO4PGNgHNN1xRY4H\nml69bPIfhoby2G8N4ryw6fLEGMD6zPAUy+EnJ883x2AFYGq22+14VAhsbrVb8FIS\ndNaoItkz0ammRCBes1FhT0ldsaqirrkY2TH1DhS7rKGfy09JDxg8e4+JZzROUgYz\nFvGqH3ePGojJXv8j4NHhw1e6aXzgtZ7QJ223krcMQQKBgQDBmYF3nVoGYSjq8ZWE\nQskZONs0PL2QkVCnQuG1EZEF1xRpi9J5oKHpLrvQ/ZsZcppnB2VylkePgGKTl2Zq\nm/XLsnTaZ4n5yvR5OYmFg+SdwS/cflvgFOlUCS2PkA6hwyldZwdOLiY589T7oDwf\nrhs97KnYQ9ZxLnFm8WzIQecySwKBgQC7J9uwXDr811nTxGpIe5r+b5dVTJ28JENa\nuR5OAeSj6hUnpOHrHQ1DGN7fpmkx2KmDVY4wWlpJlSMaA+aQgbPbEn4+hvE7d+At\ni7nGxCXdU6HriSH1CuTo7ZfADnC31TggHSIBb2jS9ZM9XmoMezW8Xx1o2GfVYg5L\nAmOiK+WO/QKBgGvaNrQKZwKy0fbBC0iZZCq27/dT9084hTQJIHCdDquwPGDoUiMM\nB+c978fn4KX2oGnRRwTlD4y0OzZ528Z8iBwomMyrbcRI+pUmJqTI622vGBjAFDLr\ns2jrjAQ0ftJDRSIRqZI2R3l1iyt7AsOrXOXMmHowoKCA/RAaYz3U6RWtAoGBALA3\n4E+XF+d3sVmGp/glghOt6JTlNeOvVUf344PZnnmD73VLd3iT+yfBJCD7JDNN6JYD\nmYUHndmItetJ3u8TYNCWAg5Hqp2uyoK3/C0eBPT3SQ9oKHP8VPrIs0ifkBxXg6gh\nJiKpzs5Lcd6npjyoSjlaaWuNz36H/CM+Vaedo2DVAoGAbWIHLtnqA0UR6GUcdRdW\nvjB3UKt5Ic2lh5jVyjqetr6ukE2AatWr5iiVuQS8lJwNYl7DkEg4cUBDUIhetWd3\nJHOWxSLzMptCu6lOLfPu2avDbDsbVBu8IJf97mKKIDVY/ydZT3fUUK2aNbmE6zc7\nWLNhQpDRlSqfpdhvjyWcW0o=\n-----END PRIVATE KEY-----\n",
#   "client_email": "firebase-adminsdk-rruod@clus-vis.iam.gserviceaccount.com",
#   "client_id": "110810605888765304277",
#   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#   "token_uri": "https://oauth2.googleapis.com/token",
#   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
#   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-rruod%40clus-vis.iam.gserviceaccount.com"
# }

firebaseConfig = {
  "type": "service_account",
  "project_id": "cs584-698ac",
  "private_key_id": "cb8f2b239d4982eb67bc2d948759ea5d919bad97",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCx43Iu3Yvb0Ww/\nQL3U5/vyrZ7ggJqSLwHuNYX7ycJmkl2HQhtt+5OWfuYZCxHAkVPDZa/ZUw+eXHkt\nuVO3dC+ffwKctJSXTn8pmN2vbfSEN6Q20+2KgXw2W+fYBxIzHeito339A6JjdYZh\nC3XI3uuvTdqO1s+zxCssboFjk7PIEViz/9Ilf8hIXk7uUxY26TVqgyr+odJUaaTm\nE710vI2pzRXyjRLOtxgGvyrqc4pQKa0vLVsUqz8Jw5T/TcxSnBk4S3aTm2qEoRDb\nBfW4KOzJfTzRRZ6ihSiIrJo6MVNGskxAk3OdBIKKK3F5GWNwpvzPMpTmGplKE1b7\nVPGHnNNFAgMBAAECggEAC4h8ia9RdwH/66Xt6NTVj+lTyKht3RZxIJmVwzpUgUPy\nDmfp0VqjOfmmP29pSjvh22RHX2a0N4c1UBKY6+b7g3K/n5tRmvG66t5/WPVfCgd1\nfRyGZRl6DSguQuJKesfwovlbnMDUkXA4MyiEDW7uhuIcTnB87OHGDs5nUyZrXIgv\nmJ7BGW794U7caRwUw6pRgbw3eQR7UcwS4CAQZ340KYdmbMNFwyp7ksGtdgyGjFnI\nhOuheXAy0STpTUfNqfiVyXWW4VV1SmxDykHXxoRWpIdFAU+WoK+1QRIeMLh0UP++\nvyAPm3KmdixgEtsLlWisSPTuQM/y7/oPEeYXdaUy7QKBgQDpc6uZA6jK0jyr6Rk8\nJZvJ6qD3USCDta2Lzsb1viLyOOTs7d9dn3cs/txsOx++oAI7X++J/bKG8n4yFUjy\nGgVuVZgL4JDwNK5ij2paGnULctOHKMnvmBgmHNLp8QpDMHXsHx2rYDF0Gf95IXu5\nqBs6AMpIhKg2o/mkuOXpN1ug6wKBgQDDEepxJyLisU/ddtOtIwLCrWN8FWDAiPYE\neUTqcZPnffJ3Nlejzmn86RVH8xvZIZV3ysYjNKJOVRp2Ph7xnIcEaeDDodl1E+fx\nkANbAcUphoGcjzPuKmXnUoXtFlLNPi1y77SjdGtP8KIqJ5cCYgvPPW8ndpULOzfR\neKYExk3QjwKBgQCo646l6HTxVVCbX85nrBre7sxMSEKLqyEJQbTLSipFNI/JNJHk\nT6fPQhbCpcFhkKwsxE0yfwT4Cmzv1mDy9Ysqe/rJ1VNqy+PG41kkG3LHtu2CJiyA\nFoCay05+AnDXjzA0i4tPXwpJpSorPuQkwZP502qLMJn694mC/Fs39ltxwwKBgQCI\nDV3Tb7VgIMUQNIlsb0fEmgQSDiL+Bkh4VFBhp7e9tFVBGjDD+fpoP/Tsyr14knja\nJR5Ofa5aLfcX0znn0AFHbcUrDR5LDwgtrgD5H2HxFXQeyq4whXevgBoSgwhbR+uR\nB2iYvGEAT1f7SMOFEPclorZ88rL/M106BwjbuaeaNwKBgCFjhsWI6aAHHKL5sd0E\nU/5Im8Lm2rWiyLhv8kuiryi3JsOYS48+KN8aXrHlRBSZx14965JvsxdtfgxznKQV\niLtEj1pvExJ29zODLICeZGUlW3N85Gzd+xNmTVTk01kHr8KkQBjfEwPh+FdD0i0P\nn6kKda7imUvNp7WY58SYCI42\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-9ylnw@cs584-698ac.iam.gserviceaccount.com",
  "client_id": "109472448746734624037",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-9ylnw%40cs584-698ac.iam.gserviceaccount.com"
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