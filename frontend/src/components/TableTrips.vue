<template>
  <q-table
    :grid="$q.screen.xs"
    :columns="columns"
    :rows="rows"
    row-key="id"
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
import { ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import TripModal from 'components/TripModal.vue';
import Api from 'src/api/api';
import getFormattedDate from 'src/utils/getFormattedDate';
import { TripWithFreePlacesInfo } from 'src/models/tripWithFreePlacesInfo';

const $q = useQuasar();

const isLoading = ref(true);

const columns = ref<QTableProps['columns']>([
  {
    name: 'departure',
    label: 'Пункт отправления',
    field: 'departureCity',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'destination',
    label: 'Пункт назначения',
    field: 'destinationCity',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'departureDate',
    label: 'Дата отправления',
    field: 'departureDate',
    required: true,
    sortable: true,
    align: 'center',
    format: (date: Date) => getFormattedDate(date),
  },
  {
    name: 'destinationDate',
    label: 'Дата прибытия',
    field: 'destinationDate',
    required: true,
    sortable: true,
    align: 'center',
    format: (date: Date) => getFormattedDate(date),
  },
  {
    name: 'freePlaces',
    label: 'Количество свободных мест',
    field: 'freePlaces',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'price',
    label: 'Стоимость',
    field: 'minPrice',
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
    },
  });
}
</script>
