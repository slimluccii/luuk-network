// Pages are prerendered, so the middleware can't set this cookie; it reads it on `/`.
import { LOCALE_COOKIE } from "~/i18n/locale-cookie";

document.cookie = `${LOCALE_COOKIE}=${document.documentElement.lang}; path=/; max-age=31536000; samesite=lax`;
