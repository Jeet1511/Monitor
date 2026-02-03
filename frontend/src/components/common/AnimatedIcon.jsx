import { useState } from 'react';

const AnimatedIcon = ({
    icon: Icon,
    size = 24,
    color = 'currentColor',
    hoverColor = 'var(--primary)',
    animation = 'scale', // scale, rotate, bounce, pulse
    className = ''
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const getAnimationStyle = () => {
        if (!isHovered) return {};

        switch (animation) {
            case 'scale':
                return { transform: 'scale(1.2)' };
            case 'rotate':
                return { transform: 'rotate(15deg) scale(1.1)' };
            case 'bounce':
                return { transform: 'translateY(-3px)' };
            case 'pulse':
                return {
                    transform: 'scale(1.1)',
                    filter: `drop-shadow(0 0 8px ${hoverColor})`
                };
            default:
                return { transform: 'scale(1.1)' };
        }
    };

    return (
        <Icon
            size={size}
            className={`icon-animated ${className}`}
            style={{
                color: isHovered ? hoverColor : color,
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                ...getAnimationStyle()
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        />
    );
};

export default AnimatedIcon;
