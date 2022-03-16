<template>
  <div :style="{width: containerWidth}">
    <editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
    </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/wordcount'

import plugins from './plugins'
import toolbar from './toolbar'

export default {
  name: 'Tinymce',
  components: { Editor },
  props: {
    // v-model
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: Array,
      required: false,
      default() {
        return []
      }
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    width: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    height: {
      type: [Number, String],
      required: false,
      default: 360
    }
  },
  data() {
    return {
      init: {
        language_url: '/static/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/static/tinymce/skins/lightgray',
        branding: false,
        height: this.height,
        plugins: plugins,
        toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
        menubar: false,
        // upload image
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        }
      },
      myValue: this.value
    }
  },
  mounted() {
    tinymce.init({})
  },
  computed: {
    containerWidth() {
      const width = this.width
      if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
        return `${width}px`
      }
      return width
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue
    },
    myValue(newValue) {
      this.$emit('input', newValue)
    }
  },
  methods: {
    // 添加事件
    // 文档 => https://github.com/tinymce/tinymce-vue => All available events
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },

    wordcount() {
      // mceu_43: <span id="mceu_43">37 字</span>
      var spanValue = document.getElementById("mceu_43").innerHTML
      var wordcount = spanValue.replace(/[^\d.]/g, "")
      return wordcount
    }

  }
}
</script>

<style>
</style>
