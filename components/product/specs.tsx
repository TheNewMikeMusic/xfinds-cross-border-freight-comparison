import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getTranslations } from 'next-intl/server'

interface SpecsProps {
  specs: {
    size?: string
    color?: string
    material?: string
  }
}

export async function Specs({ specs }: SpecsProps) {
  const t = await getTranslations('product')
  const entries = Object.entries(specs).filter(([_, value]) => value)

  if (entries.length === 0) return null

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>{t('specs')}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {specs.size && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">{t('size')}</dt>
              <dd className="text-base text-foreground">{specs.size}</dd>
            </div>
          )}
          {specs.color && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">{t('color')}</dt>
              <dd className="text-base text-foreground">{specs.color}</dd>
            </div>
          )}
          {specs.material && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground dark:text-gray-400 mb-1">{t('material')}</dt>
              <dd className="text-base text-foreground">{specs.material}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  )
}
