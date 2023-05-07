HTTP İstek Engelleme ve CAPTCHA <br>
Bu Node.js projesi, belirli bir IP adresinden gelen istek sayısının belirli bir sınırı aştığı durumlarda o IP adresini engelleyen ve kullanıcının CAPTCHA testini geçmesi gerektiren bir web sunucusu uygulamasıdır.

Proje, http, ipfilter, IpDeniedError, ve svg-captcha modüllerini kullanır.

Başlarken
Projeyi yerel bilgisayarınıza klonlamak için aşağıdaki komutu kullanabilirsiniz:

```bash
git clone https://github.com/gokhaanatees/NodeJS-Firewall.git
```
Projenin bağımlılıklarını yüklemek için aşağıdaki komutu kullanabilirsiniz:

```bash
npm install
```

Kullanım
Uygulamayı başlatmak için aşağıdaki komutu kullanabilirsiniz:

```bash
node app.js
```

Uygulama varsayılan olarak 3000 numaralı portu dinler.

Yapılandırma
Uygulamanın yapısı ve işleyişi app.js dosyasında yer almaktadır. Bu dosyada aşağıdaki değişkenleri düzenleyebilirsiniz:

maxRequestsPerMinute: Bir dakika içinde izin verilen en fazla istek sayısı. Varsayılan değer: 1000.
maxRequestsPerMinutePerIp: Bir dakika içinde aynı IP adresinden izin verilen en fazla istek sayısı. Varsayılan değer: 20.
bannedIps: Engellenen IP adresleri listesi. Varsayılan değer: [].
captchaThreshold: CAPTCHA testinin başlatılacağı istek sayısı. Varsayılan değer: 50.
