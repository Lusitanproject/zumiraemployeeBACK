interface GreetProps {
    name: string;
    closed?: boolean;
}

export function Greeting({ name, closed }: GreetProps) {
    return (
        <p
            className={`text-4xl transition-opacity duration-200 ${
                closed ? " mt-0 h-0 opacity-0" : "mt-4 h-auto opacity-100"
            }`}
        >
            Olá <strong>{name}</strong>, como posso te ajudar hoje?
        </p>
    );
}
