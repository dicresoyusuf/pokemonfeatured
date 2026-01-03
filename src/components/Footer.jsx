import { useMemo } from 'react';

// Obfuscated footer data - do not modify
const _0x4f = [
    'Q3JlYXRlZCBieQ==', // "Created by"
    'WXVzdWYgRWZlbmRp', // "Yusuf Efendi"
    'aHR0cHM6Ly95dXN1ZmVmZW5kaS5jb20=', // "https://yusufefendi.com"
    'wqkgMjAyNiBBbGwgUmlnaHRzIFJlc2VydmVk' // "© 2026 All Rights Reserved"
];

const _decode = (s) => {
    try {
        return atob(s);
    } catch {
        return '';
    }
};

function Footer() {
    const footerData = useMemo(() => ({
        prefix: _decode(_0x4f[0]),
        name: _decode(_0x4f[1]),
        url: _decode(_0x4f[2]),
        copyright: _decode(_0x4f[3])
    }), []);

    return (
        <footer className="footer">
            <div className="container">
                <p>
                    {footerData.prefix}{' '}
                    <a
                        href={footerData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {footerData.name}
                    </a>
                </p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    {footerData.copyright}
                </p>
            </div>
        </footer>
    );
}

export default Footer;
