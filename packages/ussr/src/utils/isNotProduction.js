export default function isNotProduction() {
    return process.env.NODE_ENV !== 'production';
}
