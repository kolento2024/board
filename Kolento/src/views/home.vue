<template>

  <div class="home">
    <div class="board-pool">
      <div class="cont-box" >
        <div class="form-box">
          <a-form
            :model="formData"
            :label-col="0"
            layout="inline"
            ref="formRef"
            :wrapper-col="{ span: 24 }"
            autocomplete="off">
            <a-form-item name="w" class="input-list" :rules="[{ required: true, message: '请填写宽度' }]" >
              <a-input placeholder="请输入宽度" allowClear v-model:value="formData.w" @keyup.enter="addBoard" />
            </a-form-item>

            <a-form-item label="" class="input-list" name="h" :rules="[{ required: true, message: '请填写高度' }]">
              <a-input placeholder="请输入高度" allowClear v-model:value="formData.h" @keyup.enter="addBoard" />
            </a-form-item>

            <!-- <a-form-item class="input-list">
              <a-select
                ref="select"
                v-model:value="formData.unit"
                style="width: 120px"
                @change="handleChange">
                <a-select-option :value="1">毫米(mm)</a-select-option>
                <a-select-option :value="2">厘米(cm)</a-select-option>
                <a-select-option :value="3">米(m)</a-select-option>
              </a-select>
            </a-form-item> -->

            <a-form-item :wrapper-col="{ span: 24 }" class="input-list">
              <a-button type="default" style="margin-right: 20px;" @click="reset">重置表单</a-button>
              <a-button type="primary" @click="addBoard">添加元素</a-button>
            </a-form-item>
          </a-form>
        </div>

        <div class="add-list">
          <a-list size="small" bordered :data-source="items">
            <template #renderItem="{ item,index }">
              <a-list-item class="list-item" @click="chooseOn(item,index)">
                <div class="record-box">
                  <p :class="['name',item.chooseOn?'active':'']">尺寸：{{ item.w }}*{{ item.h }}</p>
                  <div class="btn-group">
                    <a-button type="primary" size="small" @click="pos(item,index)" style="margin-right: 12px;">定位</a-button>
                    <a-button type="primary" danger size="small" @click="del(item,index)">删除</a-button>
                  </div>

                </div>
              </a-list-item>
            </template>
            <template #header>
              <div>已添加</div>
            </template>
          </a-list>
          <div class="sum-box">
            <p class="sum"><b>统计：</b></p>
            <p class="mj"><b>总面积 = </b>{{ allMj()[0] }} 平方厘米 = {{ allMj()[1] }} 平方米</p>
            <p class="mj"><b>总周长 = </b>{{ allZc()[0] }} 厘米 = {{ allMj()[1] }} 米</p>
          </div>
        </div>
      </div>
    </div>

    <div class="board-show">
      <div class="board-example"></div>
      <p class="size">尺寸：2.1米*6米</p>
      <p class="size">面积：12.6平方米</p>
      <p class="size">周长：16.2米</p>
    </div>
    <div class="board-show">
      <div class="board-example"></div>
      <p class="size">尺寸：2.1米*6米</p>
      <p class="size">面积：12.6平方米</p>
      <p class="size">周长：16.2米</p>
    </div>
  </div>

  <div>
    <div v-for="(item, index) in items"
      :key="index"
      :class="['draggable',item.chooseOn?'chooseOn':'']"
      :style="{ left: item.position.x + 'px', top: item.position.y + 'px',width: item.w + 'px', height: item.h + 'px' }"
      @mousedown="startDrag($event, index)">
      {{ item.w }}*{{ item.h }}
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

  // 表单部分
  let formData = ref({
    w: undefined,
    h: undefined,
    unit:2,
  })

  // 拖动逻辑
  const items = ref([
    // { position: { x: 0, y: 500 },w: 100, h: 100 },
    // { position: { x: 0, y: 600 },w:50,h:50 },
    // 可以根据需要添加更多项
  ]);

  let isDragging = ref(false);
  let currentIndex = ref(-1);
  let initialPosition = ref({ x: 0, y: 0 });
  let mouseOffset = ref({ x: 0, y: 0 });

  const startDrag = (event, index) => {
    isDragging.value = true;
    currentIndex.value = index;
    initialPosition.value = { ...items.value[index].position };
    mouseOffset.value = {
      x: event.clientX - items.value[index].position.x,
      y: event.clientY - items.value[index].position.y
    };
  };

  const onDrag = (event) => {
    if (isDragging.value) {
      requestAnimationFrame(() => {
        items.value[currentIndex.value].position = {
          x: event.clientX - mouseOffset.value.x,
          y: event.clientY - mouseOffset.value.y
        };
      });
    }
  };

  const stopDrag = () => {
    isDragging.value = false;
    currentIndex.value = -1;
  };

  // 计算已添加所有板子的周长和面积
  let allMj=()=>{
    let mj = 0;
    if(items.value.length>0){
      items.value.map(list=>{
        mj=mj+(list.w*list.h);
      })
    }
    return [mj,mj/10000];
  }

  let allZc=()=>{
    let zc = 0;
    if(items.value.length>0){
      items.value.map(list=>{
        zc=zc+(list.w+list.h)*2;
      })
    }
    return [zc,zc/100];
  }

  // 表单验证，添加板子
  const formRef = ref();
  let addBoard=()=>{
    formRef.value.validate().then(() => {
      items.value.push(
        { position: { x: 50, y: 600 },w: formData.value.w, h: formData.value.h }
      )
      formRef.value.resetFields();
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  let reset=()=>{
    formRef.value.resetFields();
  }

  // 删除板子
  let del=(item,index)=>{
    console.log('item',item);
    console.log('index',index);
    items.value.splice(index,1);
  }
  let pos=(item,index)=>{
    console.log('item',item);
    console.log('index',index);
    items.value.map(list=>{
      list.chooseOn=false;
    })
    item.chooseOn=true;
  }

  // 添加全局事件监听器
  onMounted(() => {
    window.addEventListener('mousemove', onDrag);
    window.addEventListener('mouseup', stopDrag);
  });

  onUnmounted(() => {
    window.removeEventListener('mousemove', onDrag);
    window.removeEventListener('mouseup', stopDrag);
  });



</script>

<style scoped lang="scss">

  .home {
    display:flex;
    justify-content: space-between;
    padding:20px;
    
    min-height: 800px;
    overflow: auto;
    min-width: 1300px;
  }
  .board-pool {
    width: calc(100% - 540px);

    .form-box {
      // width: 300px;
      .input-list {margin-bottom: 20px;}
    }
  }

  .board-show {
    width: 250px;
    padding: 20px;
    border-radius: 20px;
    background: #fff;
    height: 762px;
    .board-example {
      margin:0 auto;
      height: 600px;
      width: 210px;
      border:1px solid #333;
      background: #fafafa;
    }
    .size {
      text-align: center;
      margin-top: 12px;
    }
  }

  .cont-box {
    padding: 20px;
    border-radius: 20px;
    background: #fff;
  }

  .record-box {
    display:flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .name {
      margin: 0!important;
      
    }
    .active {
      color: #1677ff;
    }
  }
  .sum-box {
    margin-top: 12px;
    display:flex;
    align-items: center;
    p {margin: 0 20px 0 0!important;}
  }

  .draggable {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: lightblue;
    border: 1px solid #000;
    cursor: move;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chooseOn {
    background: rgb(127, 194, 127);
  }
</style>