import defaultLang from 'element-ui/src/locale/lang/zh-CN';
import Vue from 'vue';
import deepmerge from 'deepmerge';
import Format from './format';

const format = Format(Vue);
let lang = defaultLang;
let merged = false;
let i18nHandler = function() {
  const vuei18n = Object.getPrototypeOf(this || Vue).$t;
  if (typeof vuei18n === 'function' && !!Vue.locale) {
    if (!merged) {
      merged = true;
      Vue.locale(
        Vue.config.lang,
        deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
      );
    }
    return vuei18n.apply(this, arguments);
  }
};

export const t = function(path, options) {
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;

  const array = path.split('.');
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
};

export const use = function(l, langStr) {
  lang = l || lang;
  let bodyClass = document.getElementsByTagName('body')[0].classList;
  const classArr = bodyClass.value.split(' ');
  if (langStr && langStr === 'ar') {
    bodyClass.remove('element-ltr');
    const index = classArr.findIndex(el => el === 'element-rtl');
    if (index === -1) bodyClass.add('element-rtl');
  } else {
    const rtlI = classArr.findIndex(el => el === 'element-rtl');
    if (rtlI >= 0) bodyClass.remove('element-rtl');
    const j = classArr.findIndex(el => el === 'element-ltr');
    if (j === -1) bodyClass.add('element-ltr');
  }
};

export const i18n = function(fn) {
  i18nHandler = fn || i18nHandler;
};

export default { use, t, i18n };
