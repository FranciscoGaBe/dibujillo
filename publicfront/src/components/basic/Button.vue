<template>
    <button
         :class="bClass"
         v-bind="{...$attrs, ...$props}"
         v-on="$listeners"
    ><slot></slot></button>
</template>

<script>
    export default {
        name: "Button",
        props: {
            block: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: 'white'
            },
            rounded: {
                type: Boolean,
                default: true
            },
            color: {
                type: String,
                default: 'default'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                classes: [
                    'border',
                    'px-2 py-1',
                    'disabled:opacity-50',
                    'shadow-lg',
                    'disabled:cursor-not-allowed',
                    'transition duration-300 ease-in-out',
                    'focus:outline-none'
                ],
            }
        },
        computed: {

            bClass () {

                const color = this.color === 'default' ? this.$color : this.color,
                    text = this.text === 'default' ? `${this.$mode}-text` : this.text

                return [
                    ...this.classes,
                    ...[
                        this.block ? 'block w-full' : '',
                        `text-${text}`,
                        this.rounded ? 'rounded' : '',
                        `bg-${this.$mode}-${color}`,
                        `border-${this.$mode}-${color}`,
                    ],
                    ...this.disabled ? [

                    ] : [
                        `hover:bg-${this.$mode}-${color}`,
                        'hover:shadow-none'
                    ]
                ]

            },

        }
    }
</script>

<style scoped>

</style>