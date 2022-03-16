<template>
  <div class="page-title">
    <span>{{ title }}</span>
    <span style="font-weight: normal; font-size: 12px;">
      {{ tip }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'link-page-title',
  props: {
    title: String,
    tip: String
  }
}
</script>
