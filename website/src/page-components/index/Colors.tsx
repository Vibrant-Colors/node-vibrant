import styles from './Colors.module.css'
import VibrantColors from './VibrantColors';

interface ColorsProps {
    file: string;
    className?: string;
}

export const Colors = ({file, className}: ColorsProps) => {
    return (
        <div className={className}>
            <img className={styles.image} src={file} alt=""/>
            <VibrantColors img={file}/>
        </div>
    )
}
