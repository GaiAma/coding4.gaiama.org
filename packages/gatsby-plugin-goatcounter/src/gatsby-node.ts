import { NodePluginArgs } from 'gatsby';
import { PluginOptions } from './types';

export const onPreInit = (
  { reporter }: NodePluginArgs,
  options: PluginOptions
) => {
  if (!options.code) {
    reporter.error(
      `The GoatCounter plugin requires a page code. Did you mean to add it?`
    );
  }
};
