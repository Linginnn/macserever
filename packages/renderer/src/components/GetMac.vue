<template>
  <div class="container">
    <n-form
      ref="formRef"
      :model="formValue"
      label-placement="top"
      show-label
      :rules="rules"
    >
      <n-form-item
        label="药方类型"
        path="mac"
      >
        <n-select
          v-model:value="formValue.mac"
          :options="generalOptions"
          clearable
        />
      </n-form-item>
      <n-form-item
        label="自定义mac地址"
        path="cmac"
      >
        <n-input
          v-model:value="formValue.cmac"
          placeholder="输入Mac地址"
        />
      </n-form-item>
      <n-form-item>
        <n-button
          type="primary"
          attr-type="submit"
          @click="handleValidateClick"
        >
          确定
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue';
import { NForm, NFormItem, NInput, NButton, NSelect } from 'naive-ui';
export default defineComponent({
  name: 'AppNavigation',
  components: {
    NForm,
    NInput,
    NButton,
    NSelect,
    NFormItem,
  },
  setup() {
    const formRef = ref(null);
    const formValue = reactive({
      cmac: '',
      mac: 'C03C590CE244',
    });
    const handleValidateClick = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      globalThis.electron.ipcRenderer.send('mac', toRaw(formValue));
    };
    return {
      // - C03C590CE244 西药房mac地址
      // - 5405DB70B6CC 中药房mac地址
      formRef,
      formValue,
      generalOptions: ref([
        {
          label: '中药房-5405DB70B6CC',
          value: '5405DB70B6CC',
        },
        {
          label: '西药房-C03C590CE244',
          value: 'C03C590CE244',
        },
      ]),
      rules: {
        mac: {
          required: true,
          message: '请选择',
        },
      },
      handleValidateClick,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  height: 100vh;
  justify-content: center;
  background-color: aliceblue;
}
</style>
