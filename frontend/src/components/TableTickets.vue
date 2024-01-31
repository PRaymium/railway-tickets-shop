<template>
  <q-table
    :grid="$q.screen.xs"
    :columns="columns"
    :rows="rows"
    row-key="id"
    :binary-state-sort="true"
    @row-click="(evt, row) => onRowClick(row)"
  >
  </q-table>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import TicketModal from 'components/TicketModal.vue';

const $q = useQuasar();

const columns = ref<QTableProps['columns']>([
  {
    name: 'departure',
    label: 'Пункт отправления',
    field: 'departure',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'destination',
    label: 'Пункт назначения',
    field: 'destination',
    required: true,
    sortable: true,
    align: 'center',
  },
  {
    name: 'departureTime',
    label: 'Время отправления',
    field: 'departureTime',
    required: true,
    sortable: true,
    align: 'center',
    format: (date: Date) =>
      `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
  },
  {
    name: 'destinationTime',
    label: 'Время прибытия',
    field: 'destinationTime',
    required: true,
    sortable: true,
    align: 'center',
    format: (date: Date) =>
      `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
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
    field: 'price',
    required: true,
    sortable: true,
    align: 'center',
    format: (val) => `от ${val}₽`,
  },
]);

export interface Ticket {
  id: string;
  departure: string;
  destination: string;
  departureTime: Date;
  destinationTime: Date;
  freePlaces: number;
  price: number;
}

const rows = ref<Ticket[]>([
  {
    id: '1',
    departure: 'Липецк',
    destination: 'Москва',
    departureTime: new Date('2024-02-04'),
    destinationTime: new Date('2024-02-05'),
    freePlaces: 7,
    price: 2440,
  },
  {
    id: '2',
    departure: 'Москва',
    destination: 'Санкт-Петербург',
    departureTime: new Date('2024-02-04'),
    destinationTime: new Date('2024-02-05'),
    freePlaces: 43,
    price: 7540,
  },
  {
    id: '3',
    departure: 'Воронеж',
    destination: 'Липецк',
    departureTime: new Date('2024-02-04'),
    destinationTime: new Date('2024-02-05'),
    freePlaces: 23,
    price: 5790,
  },
  {
    id: '4',
    departure: 'Воронеж',
    destination: 'Тула',
    departureTime: new Date('2024-02-04'),
    destinationTime: new Date('2024-02-05'),
    freePlaces: 15,
    price: 4760,
  },
  {
    id: '5',
    departure: 'Санкт-Петербург',
    destination: 'Тула',
    departureTime: new Date('2024-02-04'),
    destinationTime: new Date('2024-02-05'),
    freePlaces: 8,
    price: 4570,
  },
]);

function onRowClick(row: Ticket) {
  $q.dialog({
    component: TicketModal,
    componentProps: {
      ...row,
    },
  });
}
</script>
