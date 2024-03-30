<template>
    <div class="container-custom">
        <div class="container">
            <div v-if="authUser" class="row justify-content-center align-items-center">

                <!-- Card 1 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">POWERSERVE</h5>
                            <a href="#" class="stretched-link"></a>
                        </div>
                    </div>
                </div> -->

                <!-- Card 2 -->
                <div class="col-md-4 mb-4">
                    <div class="card shadow text-white"
                        :class="{ 'bg-primary': canViewSystem, 'bg-secondary': !canViewSystem }">
                        <div class="card-body">
                            <h5 class="card-title">SYSTEM</h5>
                            <nuxt-link v-if="canViewSystem" to="/system" class="stretched-link"></nuxt-link>
                        </div>
                    </div>
                </div>

                <!-- Card 3 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">e-FORMS</h5>
                            <nuxt-link to="/e-forms" class="stretched-link"></nuxt-link>
                        </div>
                    </div>
                </div> -->

                <!-- Card 4 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">eCONNECT</h5>
                            <a href="econnect.html" class="stretched-link"></a>
                        </div>
                    </div>
                </div> -->

                <!-- Card 5 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">POWERBILL</h5>
                            <a href="powerbill.html" class="stretched-link"></a>
                        </div>
                    </div>
                </div> -->

                <!-- Card 6 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">LPS</h5>
                            <a href="lps.html" class="stretched-link"></a>
                        </div>
                    </div>
                </div> -->

                <!-- Card 7 -->
                <div class="col-md-4 mb-4">
                    <div class="card shadow text-white"
                        :class="{ 'bg-primary': canViewWarehouse, 'bg-secondary': !canViewWarehouse }">
                        <div class="card-body">
                            <h5 class="card-title">POWERHOUSE</h5>
                            <nuxt-link to="/warehouse" class="stretched-link"></nuxt-link>
                        </div>
                    </div>
                </div>

                <!-- Card 8 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">ACCOUNTING</h5>
                            <a href="accounting.html" class="stretched-link"></a>
                        </div>
                    </div>
                </div> -->

                <!-- Card 9 -->
                <!-- <div class="col-md-4 mb-4">
                    <div class="card shadow bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">POWERPAY</h5>
                            <a href="powerpay.html" class="stretched-link"></a>
                        </div>
                    </div>
                </div> -->

            </div>

            <div v-else>
                <LoaderSpinner />
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">

definePageMeta({
    layout: "layout-home"
})

const authUser = ref<AuthUser>()

onMounted(() => {
    authUser.value = getAuthUser()
})


const canViewSystem = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    return !!authUser.value.user.permissions.canViewSystem

})


const canViewWarehouse = computed(() => {

    if (!authUser.value) return false

    if (isAdmin(authUser.value)) return true

    if (!authUser.value.user.permissions) return false

    return !!authUser.value.user.permissions.canViewWarehouse

})

</script>



<style scoped>
.container-custom {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
    margin: 0;
}

.card {
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>