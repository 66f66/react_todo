import { cn } from '@/lib/utils'
import { AsteriskIcon } from 'lucide-react'
import type { ComponentPropsWithoutRef, FC } from 'react'

type RequiredLabelIconProps = ComponentPropsWithoutRef<typeof AsteriskIcon>

export const RequiredLabelIcon: FC<RequiredLabelIconProps> = ({
  className,
  ...props
}) => {
  return (
    <AsteriskIcon
      {...props}
      className={cn('text-destructive inline size-4 align-top', className)}
    />
  )
}
