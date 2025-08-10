import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogOverlay } from '../ui/dialog'
import { useDispatch } from 'react-redux';
import { modalActions } from '@/store';

type Props = {
    title: string,
    description: string,
    isOpen: boolean,
    children?: React.ReactNode,
}

const Modal = ({ title, description, isOpen, children }: Props) => {
    const dispatch = useDispatch();

    const onChange = (open: boolean) => {
        if (!open) dispatch(modalActions.close())
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogOverlay className='backdrop-blur-[4px]' />
            <DialogContent className='max-w-max'>
                <DialogHeader>
                    <DialogTitle className='tracking-wider'>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                {children}
            </DialogContent>
        </Dialog>
    )
}

export default Modal