<template>
    <div class="example">{{ msg }}</div>
</template>

<script>
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class HelloDecorator extends Vue {
        @Prop() msg!: 'Hello world!';
    }
</script>

<style>
    .example {
        color: red;
    }
</style>