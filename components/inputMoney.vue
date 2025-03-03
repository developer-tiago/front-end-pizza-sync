<script>
  import { Money3Component } from 'v-money3'

  export default {
    components: { money3: Money3Component },
    data () {
      return {
        config: {
          masked: false,
          prefix: 'R$ ',
          suffix: '',
          thousands: '.',
          decimal: ',',
          precision: 2,
          disableNegative: false,
          disabled: false,
          min: null,
          max: null,
          allowBlank: false,
          minimumNumberOfCharacters: 0,
          shouldRound: true,
          focusOnRight: false,
        }
      }
    }
  }
</script>

<template>
  <money3 class="input input-bordered input-md" v-bind="config"></money3>
</template>