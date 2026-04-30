import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
    // Fixes "unable to get local issuer certificate" on some Mac / corporate setups
    // where Cloudinary's HTTPS chain is not trusted. Prefer NODE_EXTRA_CA_CERTS or
    // fixing system trust instead of leaving this on.
    if (process.env.CLOUDINARY_TLS_SKIP_VERIFY === '1') {
        console.warn(
            '\n  [MediConnect] CLOUDINARY_TLS_SKIP_VERIFY=1 — TLS verification is OFF for this Node process.',
            '\n  Use only for local dev. Remove it for production. Prefer: NODE_EXTRA_CA_CERTS=/path/to/corp-root.pem\n'
        );
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET,
    });

}

export default connectCloudinary;