const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizes = {
        sm: 24,
        md: 40,
        lg: 60
    };

    return (
        <div className="flex flex-col items-center justify-center gap-md">
            <div
                className="loading-spinner"
                style={{
                    width: sizes[size],
                    height: sizes[size]
                }}
            />
            {text && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {text}
                </p>
            )}
        </div>
    );
};

export default LoadingSpinner;
