<template>
  <q-select
    v-model="select"
    map-options
    :options="selectOptions"
    option-value="label"
    outlined
    dense
    label="Сортировка"
    @update:model-value="(value: SelectOptionsType) => SortInputHandler(value)"
  >
  </q-select>
</template>

<script setup lang="ts">
import { QTable } from 'quasar';
import { ref, computed } from 'vue';

type ColumnType = {
  name: string;
  label: string;
};

interface Props {
  columns?: ColumnType[];
  tableRef?: QTable;
}

const props = defineProps<Props>();

const emits = defineEmits<{
  select: [value: SelectOptionsType];
}>();

const select = ref<SelectOptionsType>();

export type SelectOptionsType = {
  label: string;
  sortOrder: 'ad' | 'da';
  name: string;
};

const selectOptions = computed<SelectOptionsType[]>(() => {
  const res: SelectOptionsType[] = [];
  props.columns?.forEach((column: ColumnType) => {
    const name = column.name;

    const objAsc = {
      label: column.label + ' (по возр.)',
      sortOrder: 'ad',
      name,
    } as SelectOptionsType;

    const objDesc = {
      label: column.label + ' (по убыв.)',
      sortOrder: 'da',
      name,
    } as SelectOptionsType;

    res.push(objAsc);
    res.push(objDesc);
  });

  return res;
});

function SortInputHandler(value: SelectOptionsType) {
  emits('select', value);
}
</script>
