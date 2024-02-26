<template>

    <div class="row justify-content-center">

        <div class="col-lg-10">

            <div v-if="item">
                <div class="alert alert-success" role="alert">
                    MEQS created successfully! 
                </div>
            </div>


        </div>

    </div>

</template>


<script setup lang="ts">

    definePageMeta({
        layout: "layout-admin"
    })

    import { MOBILE_WIDTH } from '~/utils/config';
    import * as meqsApi from '~/composables/warehouse/meqs/meqs.api'
    import type { MEQS } from '~/composables/warehouse/meqs/meqs.types';


    const route = useRoute()
    const item = ref<MEQS | undefined>()
    const isMobile = ref(false)


    onMounted( async() => {

        isMobile.value = window.innerWidth < MOBILE_WIDTH

        window.addEventListener('resize', checkMobile);

        item.value = await meqsApi.findOne(route.params.id as string)

    })

    function checkMobile() {
        isMobile.value = window.innerWidth < MOBILE_WIDTH
    }

</script>