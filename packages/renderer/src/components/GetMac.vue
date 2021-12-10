<template>
  <div class="container">
    <div class="con">
      <n-button type="info" @click="showModal = true"> 配置MAC地址 </n-button>
      <n-modal v-model:show="showModal" style="width: 80%">
        <n-card title="配置mac地址">
          <template #header-extra>
            <n-button type="info" @click="showModal2 = true"> 新增 </n-button>
          </template>
          <n-data-table
            :columns="columns"
            :data="data"
            :pagination="pagination"
          />
        </n-card>
      </n-modal>
      <n-modal v-model:show="showModal2" style="width: 80%">
        <n-card title="配置mac地址">
          <n-form
            ref="formRef2"
            :model="formValue2"
            label-placement="top"
            show-label
            :rules="rules2"
          >
            <n-form-item label="mac地址" path="value">
              <n-input
                v-model:value="formValue2.value"
                placeholder="输入Mac地址"
              />
            </n-form-item>
            <n-form-item label="名称" path="label">
              <n-input
                v-model:value="formValue2.label"
                placeholder="输入名称"
              />
            </n-form-item>
          </n-form>
          <template #action>
            <n-button type="info" @click="handleGetData"> 确定 </n-button>
          </template>
        </n-card>
      </n-modal>
    </div>

    <n-form
      ref="formRef"
      :model="formValue"
      label-placement="top"
      show-label
      :rules="rules"
    >
      <n-form-item label="药方类型" path="mac">
        <n-select v-model:value="formValue.mac" :options="data" clearable />
      </n-form-item>
      <n-form-item label="自定义mac地址" path="cmac">
        <n-input v-model:value="formValue.cmac" placeholder="输入Mac地址" />
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
import { defineComponent, reactive, ref, toRaw, h } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSelect,
  NDataTable,
  NModal,
  NCard,
  useMessage,
} from "naive-ui";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//  @ts-ignore
const createColumns = ({ deletelM }) => {
  return [
    {
      title: "mac地址",
      key: "value",
      align: "center",
    },
    {
      title: "名称",
      key: "label",
      align: "center",
    },
    {
      title: "操作",
      key: "actions",
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //  @ts-ignore
      render(row) {
        return h(
          NButton,
          {
            size: "small",
            type: "error",
            onClick: () => deletelM(row),
          },
          { default: () => "删除" }
        );
      },
    },
  ];
};
export default defineComponent({
  name: "AppNavigation",
  components: {
    NForm,
    NInput,
    NButton,
    NSelect,
    NFormItem,
    NDataTable,
    NModal,
    NCard,
  },
  setup() {
    localStorage.setItem(
      "macs",
      JSON.stringify([
        {
          value: "C03C590CE244",
          label: "西药房-C03C590CE244",
        },
        {
          value: "5405DB70B6CC",
          label: "中药房-5405DB70B6CC",
        },
      ])
    );
    const formRef = ref(null);
    const formRef2 = ref(null);
    const showModal2 = ref(false);
    const message = useMessage();
    const formValue = reactive({
      cmac: "",
      mac: "C03C590CE244",
    });
    const formValue2 = reactive({
      label: "",
      value: "",
    });
    const macs = localStorage.getItem("macs");
    const data = ref(
      macs
        ? JSON.parse(macs)
        : [
            {
              value: "C03C590CE244",
              label: "西药房-C03C590CE244",
            },
            {
              value: "5405DB70B6CC",
              label: "中药房-5405DB70B6CC",
            },
          ]
    );
    const handleValidateClick = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      const target =toRaw(data.value).find((item:any) => item.value === formValue.mac);
      //  @ts-ignore
      globalThis.electron.ipcRenderer.send("mac", target);
    };
    const handleGetData = () => {
      formRef2.value &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //  @ts-ignore
        formRef2.value.validate((errors: any) => {
          if (!errors) {
            const oldData = localStorage.getItem("macs");
            const newData = oldData
              ? [...JSON.parse(oldData), toRaw(formValue2)]
              : [toRaw(formValue2)];
            localStorage.setItem("macs", JSON.stringify(newData));
            showModal2.value = false;
            data.value = newData;
            message.success("修改成功");
          }
        });
    };

    return {
      // - C03C590CE244 西药房mac地址
      // - 5405DB70B6CC 中药房mac地址
      formRef,
      formRef2,
      formValue,
      formValue2,
      data,
      columns: createColumns({
        deletelM(rowData: { value: any }) {
          const newData = data.value.filter(
            (item: { value: any }) => item.value !== rowData.value
          );
          localStorage.setItem("macs", JSON.stringify(newData));
          data.value = newData;
          // message.info('send mail to ' + rowData.name);
        },
      }),
      pagination: {
        pageSize: 10,
      },
      showModal: ref(false),
      showModal2,
      rules: {
        mac: {
          required: true,
          message: "请选择",
        },
      },
      rules2: {
        mac: {
          required: true,
          message: "请选择",
        },
        name: {
          required: true,
          message: "请选择",
        },
      },
      handleValidateClick,
      handleGetData,
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
.con {
  position: fixed;
  right: 30px;
  top: 50px;
}
</style>
