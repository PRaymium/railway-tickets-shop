<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row">
        <div class="text-h6">Приобрести билет</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section>
        <q-list>
          <q-item
            class="q-px-none"
            v-for="(ticket, idx) of ticketInfo"
            :key="idx"
          >
            <q-item-section>
              <q-item-label overline>{{ ticket.label }}</q-item-label>
              <div>{{ ticket.value }}</div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-separator />

      <q-card-section> Train seats select block</q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Купить" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { type Ticket } from './TableTickets.vue';
import { ref } from 'vue';

const props = defineProps<Ticket>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK();
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}

const ticketInfo = ref<{ label: string; value: string }[]>([
  {
    label: 'Пункт отправления',
    value: props.departure,
  },
  {
    label: 'Пункт назначения',
    value: props.destination,
  },
  {
    label: 'Дата отправления',
    value: getFormattedDate(props.departureTime),
  },
  {
    label: 'Дата прибытия',
    value: getFormattedDate(props.destinationTime),
  },
]);

function getFormattedDate(date: Date): string {
  const hours = date.getHours();
  const hoursStr = ('0' + hours).slice(-2);
  const minutes = date.getMinutes();
  const minutesStr = ('0' + minutes).slice(-2);

  return `${date.toLocaleDateString()} - ${hoursStr}:${minutesStr} `;
}
</script>
