
interface SectionHeaderProps {
    title: string;
    subtitle: string;
    className?: string;
}

export function SectionHeader({ title, subtitle, className = '' }: SectionHeaderProps) {
    return (
        <div className={`text-center mb-12 ${className}`}>
            <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">{title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mt-4">{subtitle}</p>
        </div>
    );
}
