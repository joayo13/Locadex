import { ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

type AnimatedLinkProps = {
    to: string;
    children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const AnimatedLink: React.FC<AnimatedLinkProps> = ({
    to,
    children,
    onClick,
    ...rest
}) => {
    const navigate = useNavigate();

    const handleClick = (
        ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
        ev.preventDefault(); // Prevent default anchor behavior

        // Call the external onClick handler if provided
        if (onClick) {
            onClick(ev);
        }

        // Perform navigation with view transition
        document.startViewTransition(() => {
            flushSync(() => {
                navigate(to);
            });
        });
    };

    return (
        <a
            href={to}
            onClick={handleClick} // Use the combined handler
            {...rest} // Spread any additional props (like className, etc.)
        >
            {children}
        </a>
    );
};

export default AnimatedLink;
