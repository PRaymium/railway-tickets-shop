<template>
  <div v-if="$q.screen.lt.md" class="q-py-md">
    <table-sort-select
      :columns="columns"
      :table-ref="tableRef"
      @select="(value) => tableRef?.sort(value)"
    />
  </div>

  <q-table
    ref="tableRef"
    :grid="$q.screen.lt.md"
    :columns="columns"
    :rows="rows"
    :row-key="(row: TripWithFreePlacesInfo) => row.id.toString()"
    :binary-state-sort="true"
    :loading="isLoading"
    :pagination="{
      rowsPerPage: 0,
    }"
    @row-click="(evt, row) => onRowClick(row)"
  >
  </q-table>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QTable, QTableProps, useQuasar } from 'quasar';
import TripModal, { TripModalProps } from 'components/TripModal.vue';
import Api from 'src/api/api';
import getFormattedDate from 'src/utils/getFormattedDate';
import { TripWithFreePlacesInfo } from 'src/models/tripWithFreePlacesInfo';
import TableSortSelect from './TableSortSelect.vue';

const $q = useQuasar();

const isLoading = ref(true);

const columns = ref<QTableProps['columns']>([
  {
    name: 'departure',
    label: 'Пункт отправления',
    field: (row: TripWithFreePlacesInfo) => row.departureCityName,
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'destination',
    label: 'Пункт назначения',
    field: (row: TripWithFreePlacesInfo) => row.destinationCityName,
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'departureDate',
    label: 'Дата отправления',
    field: (row: TripWithFreePlacesInfo) => row.departureDate,
    required: true,
    sortable: true,
    align: 'center',
    format: (date: Date) => getFormattedDate(date),
  },
  {
    name: 'destinationDate',
    label: 'Дата прибытия',
    field: (row: TripWithFreePlacesInfo) => row.destinationDate,
    required: true,
    sortable: true,
    align: 'center',
    format: (date: Date) => getFormattedDate(date),
  },
  {
    name: 'freePlaces',
    label: 'Количество свободных мест',
    field: (row: TripWithFreePlacesInfo) => row.freePlaces,
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'price',
    label: 'Стоимость',
    field: (row: TripWithFreePlacesInfo) => row.minPrice,
    required: true,
    sortable: true,
    align: 'center',
    format: (val) => `от ${val}₽`,
  },
]);

const rows = ref<TripWithFreePlacesInfo[]>([]);

Api.getTripsWithTicketInfo().then((data) => {
  if (!data) return;
  rows.value.push(...data);
  isLoading.value = false;
});

function onRowClick(row: TripWithFreePlacesInfo) {
  $q.dialog({
    component: TripModal,
    componentProps: {
      id: row.id,
    } as TripModalProps,
  });
}

const tableRef = ref<QTable>();
</script>
