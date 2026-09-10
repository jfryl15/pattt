# آماده‌سازی Railway

این نسخه با Dockerfile ریشه‌ای و تنظیمات Railway آماده شده است.

## Deploy
1. محتویات این پروژه را در ریشه یک GitHub repository قرار دهید.
2. در Railway گزینه Deploy from GitHub را بزنید و repository را انتخاب کنید.
3. Railway باید Dockerfile ریشه را تشخیص دهد.
4. یک Volume بسازید و Mount Path را `/data` قرار دهید.
5. بعد از Deploy، دامنه Railway را باز کنید و حساب مدیر را بسازید.

## Environment
معمولاً فقط این مقدار لازم است:
- `SEM_DATA_DIR=/data`

`PORT` را دستی تنظیم نکنید؛ Railway آن را خودش تعیین می‌کند.

## اتصال SoftEther
این سرویس پنل مدیریت است و SoftEther VPN Server را داخل Railway نصب نمی‌کند. بعد از ورود، مشخصات سرور SoftEther را در بخش اتصال وارد کنید.

## نکته
برای نگه‌داری دیتابیس SQLite و تنظیمات، Volume روی `/data` ضروری است.
