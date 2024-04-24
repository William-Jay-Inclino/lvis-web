<template>
    <div id="wrapper">
        <nav class="navbar sticky-top navbar-expand-lg navbar-dark" style="background-color: #1877F2;">
            <div v-if="authUser" class="container">
                <a class="navbar-brand" href="#">
                    Welcome, {{ authUser.user.username }}! Have a productive day 
                    <i class="fas fa-smile"></i>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li v-if="isApprover(authUser)" class="nav-item">
                            <nuxt-link class="nav-link me-3 text-white position-relative" to="/e-forms/pendings">
                                <i class="fas fa-bell"></i>
                                <span
                                    class="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{ totalPendings }}
                                </span>
                            </nuxt-link>
                        </li>
                        <li class="nav-item dropdown">
                            <a style="color: #FFFF00;" class="nav-link dropdown-toggle" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-user-circle"></i>
                                <span class="fw-bold fst-italic ms-1">

                                    {{ authUser.user.username }}

                                </span>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Profile</a></li>
                                <li><a class="dropdown-item" href="#">Settings</a></li>
                                <li><a class="dropdown-item" href="#">Activity log</a></li>
                                <li><nuxt-link class="dropdown-item" to="/">Logout</nuxt-link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container main-content">
            <slot />

        </div>

        <br />
        <br />
        <Footer />

    </div>
</template>



<script setup lang="ts">

const authUser = ref<AuthUser>()

onMounted(() => {
    authUser.value = getAuthUser()
})

const totalPendings = computed(() => {
    if (!authUser.value) return
    if (authUser.value.user.user_employee?.employee.total_pending_approvals) {
        return authUser.value.user.user_employee?.employee.total_pending_approvals
    }
    return 0
})

const isApprover = (authUser: AuthUser) => {

    const total_pendings = authUser.user.user_employee?.employee.total_pending_approvals
    if (total_pendings && total_pendings > 0) {
        return true
    }

}

</script>
