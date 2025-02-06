export interface JoinData {
    email: string;
    password: string;
    size: string;
    code: string
}

export interface JoinComponentsProps {
    setSizeModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSize: React.Dispatch<React.SetStateAction<string>>;
    size: string;
}