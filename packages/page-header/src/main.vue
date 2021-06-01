<!--
 * @Descripttion: 
 * @version: feature-2.1.0
 * @Author: wenzch
 * @Date: 2021-05-10 10:09:28
 * @LastEditors: wenzch
 * @LastEditTime: 2021-05-28 11:23:31
-->
<template>
  <div class="el-page-header">
    <div class="el-page-header__left" @click="$emit('back')">
      <i :class="`el-icon-${isRtl ? 'right' : 'back'}`"></i>
      <div class="el-page-header__title">
        <slot name="title">{{ title }}</slot>
      </div>
    </div>
    <div class="el-page-header__content">
      <slot name="content">{{ content }}</slot>
    </div>
  </div>
</template>

<script>
import { t } from 'element-ui/src/locale';
import { isRtl } from 'element-ui/src/utils/util';

export default {
  name: 'ElPageHeader',

  props: {
    title: {
      type: String,
      default() {
        return t('el.pageHeader.title');
      }
    },
    content: String
  },

  // TODO: rtl el-page-header 页头 wenzc -- start
  computed: {
    isRtl() {
      return isRtl();
    }
  }
  // TODO: rtl el-page-header 页头 wenzc -- end
};
</script>
