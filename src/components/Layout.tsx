import cn from 'classnames';
import { useAtom, useAtomValue } from "jotai";
import React from "react";
import { Portal } from "react-portal";
import { useQuery } from "react-query";
import agent, { SESSION_LOCAL_STORAGE_KEY } from "../Agent";
import { newAtom } from "../store/new";
import { userAtom } from "../store/user";
import BackButton from "./BackButton";
import Loading from "./Loading";
import NewModal from "./NewModal";

export default function Layout(props: {
    children?: React.ReactNode
    backButton?: boolean,
    className?: string
}) {
    const { children, backButton, className } = props;
    const [user,setUser] = useAtom(userAtom);
    const newModal = useAtomValue(newAtom);

    const _getProfile = async () => {
        
        const localData = localStorage.getItem(SESSION_LOCAL_STORAGE_KEY);
        if (localData) {
            const parsedData = JSON.parse(localData);
            try {
                const data = await agent.getProfile({
                    actor: parsedData.did
                });
                setUser(data.data);
                return data;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        }
    };
    const { data, isLoading } = useQuery("profile", _getProfile);

    return (
        <div className="feed">
            {!isLoading ? <>
                <div className={cn("feed-center",className)}>
                    {backButton ? <div className="back-button-wrapper"><BackButton /></div> : ''}
                    {children}
                </div>
            </> : <div className="d-flex align-items-center justify-content-center p-5 w-100"><Loading isColored /></div>}
            {newModal.show ? <Portal><NewModal /></Portal> : ''}
        </div>
    );
}