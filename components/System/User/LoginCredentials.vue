<template>
    <div>

        <div class="mb-3">
            <label class="form-label">
                Username
            </label>
            <div class="input-group">
                <input type="text" class="form-control" :value="username" @input="onUpdateUsername">
                <span class="input-group-text">
                    <button @click="emits('checkUsernameAvailability', username)"
                        class="btn btn-sm btn-light text-primary">
                        {{ isCheckingUnAvailability ? 'Checking availability...' : 'Check availability' }}
                    </button>
                </span>
            </div>
            <small class="text-danger fst-italic" v-if="isUsernameExist"> Username already exist </small>
            <small class="text-success fst-italic" v-else> Username is available </small>
        </div>

        <div class="mb-3">
            <label class="form-label">
                Password
            </label>
            <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'" class="form-control" :value="password">
                <span class="input-group-text">
                    <button @click="showPassword = !showPassword" class="btn btn-sm btn-light">
                        <i class="fas text-primary"
                            :class="{ 'fa-eye': showPassword, 'fa-eye-slash': !showPassword }"></i>
                    </button>
                </span>
            </div>
        </div>

    </div>
</template>



<script setup lang="ts">

const emits = defineEmits(['checkUsernameAvailability', 'updateUsername', 'updatePassword']);

const props = defineProps({
    isUsernameExist: {
        type: Boolean,
        default: false
    },
    isCheckingUnAvailability: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
});

const showPassword = ref(false)

const onUpdateUsername = (event: any) => {
    emits('updateUsername', event.target.value)
}

</script>