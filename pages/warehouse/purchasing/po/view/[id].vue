<template>

    <div> po view </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import * as poApi from '~/composables/warehouse/po/po.api'
    import type { PO } from '~/composables/warehouse/po/po.types';
    import { MOBILE_WIDTH } from '~/utils/config';
    import { approvalStatus } from '~/utils/constants'

    const route = useRoute()
    const item = ref<PO | undefined>()
    const isMobile = ref(false)

    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await poApi.findOne(route.params.id as string)

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>