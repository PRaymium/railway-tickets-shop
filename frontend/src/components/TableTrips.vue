<template>
  <div class="q-py-md row q-gutter-md">
    <q-btn icon="filter_list" @click="filterModal = true" />

    <table-sort-select
      v-if="$q.screen.lt.md"
      class="col"
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
    :filter="filtersTerms"
    :filter-method="tripTableFiltering"
    @row-click="(evt, row) => onRowClick(row)"
  >
  </q-table>

  <q-dialog v-model="filterModal">
    <q-card>
      <q-card-section>
        <div class="row">
          <div class="text-h6">Фильтрация</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section
        class="q-py-sm"
        v-for="value in Object.values(FiltersTypes).filter((value) =>
          Number.isInteger(value)
        )"
        :key="value"
      >
        <q-select
          style="min-width: 300px"
          v-model="filters.selected[value as FiltersTypes]"
          map-options
          :label="filters.labels[value as FiltersTypes]"
          :options="filters.options[value as FiltersTypes]"
          option-label="label"
          outlined
          dense
          clearable
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ComputedRef, computed, ref } from 'vue';
import { QTable, QTableProps, useQuasar } from 'quasar';
import TripModal, { TripModalProps } from 'components/TripModal.vue';
import Api from 'src/api/api';
import getFormattedDate from 'src/utils/getFormattedDate';
import { TripWithFreePlacesInfo } from 'src/models/tripWithFreePlacesInfo';
import TableSortSelect from './TableSortSelect.vue';

const $q = useQuasar();

const isLoading = ref(true);

const tableRef = ref<QTable>();

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

const filterModal = ref(false);

enum FiltersTypes {
  'departureCity',
  'destinationCity',
}

type FilterItemType = {
  label: string;
  value: any;
};

const filters = ref({
  labels: {
    [FiltersTypes.departureCity]: 'Город отправления',
    [FiltersTypes.destinationCity]: 'Город назначения',
  } as Record<FiltersTypes, string>,
  options: {} as Record<FiltersTypes, FilterItemType[] | ComputedRef>,
  selected: {} as Record<FiltersTypes, FilterItemType>,
});

const departureCityFilterOptions = computed<FilterItemType[]>(() => {
  let res: FilterItemType[] = [];

  if (!filters.value.selected[FiltersTypes.destinationCity]) {
    res = rows.value.map((row) => {
      return {
        label: row.departureCityName,
        value: row.departureCityName,
      } as FilterItemType;
    });
  } else {
    res = rows.value
      .filter(
        (row) =>
          filters.value.selected[FiltersTypes.destinationCity].value ==
          row.destinationCityName
      )
      .map((row) => {
        return {
          label: row.departureCityName,
          value: row.departureCityName,
        } as FilterItemType;
      });
  }

  return res;
});

const destinationCityFilterOptions = computed<FilterItemType[]>(() => {
  let res: FilterItemType[] = [];

  if (!filters.value.selected[FiltersTypes.departureCity]) {
    res = rows.value.map((row) => {
      return {
        label: row.destinationCityName,
        value: row.destinationCityName,
      } as FilterItemType;
    });
  } else {
    res = rows.value
      .filter(
        (row) =>
          filters.value.selected[FiltersTypes.departureCity].value ===
          row.departureCityName
      )
      .map((row) => {
        return {
          label: row.destinationCityName,
          value: row.destinationCityName,
        } as FilterItemType;
      });
  }

  return res;
});

filterCityOptionsInit();

function filterCityOptionsInit() {
  filters.value.options[FiltersTypes.departureCity] =
    departureCityFilterOptions;

  filters.value.options[FiltersTypes.destinationCity] =
    destinationCityFilterOptions;
}

const filtersTerms = computed<FilterTerm[]>(() => {
  const res = Object.entries(filters.value.selected)
    .filter((entry) => entry[1])
    .map((entry) => {
      return {
        value: entry[1].value,
        filterType: +entry[0],
      };
    });
  return res;
});

type FilterTerm = {
  filterType: FiltersTypes;
  value: FilterItemType['value'];
};

function tripTableFiltering(
  rows: readonly TripWithFreePlacesInfo[],
  terms: FilterTerm[]
): readonly TripWithFreePlacesInfo[] {
  let rowsRes = rows;

  terms.forEach((term) => {
    switch (term.filterType) {
      case FiltersTypes.departureCity: {
        rowsRes = rowsRes.filter((row) => row.departureCityName == term.value);
        break;
      }
      case FiltersTypes.destinationCity: {
        rowsRes = rowsRes.filter(
          (row) => row.destinationCityName == term.value
        );
        break;
      }
      default: {
        throw new Error('Column name not defined!');
      }
    }
  });

  return rowsRes;
}
</script>
