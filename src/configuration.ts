/*!
* elasticlunr.Configuration
* Copyright (C) @YEAR Wei Song
*/
import { utils } from './utils';

export type BoolTypes = 'OR' | 'AND';
export type ConfigItem = { boost: number; bool: BoolTypes, expand: boolean };

export interface Config extends ConfigItem {
  fields?: {
    [index: string]: ConfigItem
  };
}

export class Configuration {
  config: Config;

  /** 
    * elasticlunr.Configuration is used to analyze the user search configuration.
    * 
    * By elasticlunr.Configuration user could set query-time boosting, boolean model in each field.
    * 
    * Currently configuration supports:
    * 1. query-time boosting, user could set how to boost each field.
    * 2. boolean model chosing, user could choose which boolean model to use for each field.
    * 3. token expandation, user could set token expand to True to improve Recall. Default is False.
    * 
    * Query time boosting must be configured by field category, "boolean" model could be configured 
    * by both field category or globally as the following example. Field configuration for "boolean"
    * will overwrite global configuration.
    * Token expand could be configured both by field category or golbally. Local field configuration will
    * overwrite global configuration.
    * 
    * configuration example:
    * {
    *   fields:{ 
    *     title: {boost: 2},
    *     body: {boost: 1}
    *   },
    *   bool: "OR"
    * }
    * 
    * "bool" field configuation overwrite global configuation example:
    * {
    *   fields:{ 
    *     title: {boost: 2, bool: "AND"},
    *     body: {boost: 1}
    *   },
    *   bool: "OR"
    * }
    * 
    * "expand" example:
    * {
    *   fields:{ 
    *     title: {boost: 2, bool: "AND"},
    *     body: {boost: 1}
    *   },
    *   bool: "OR",
    *   expand: true
    * }
    * 
    * "expand" example for field category:
    * {
    *   fields:{ 
    *     title: {boost: 2, bool: "AND", expand: true},
    *     body: {boost: 1}
    *   },
    *   bool: "OR"
    * }
    * 
    * setting the boost to 0 ignores the field (this will only search the title):
    * {
    *   fields:{
    *     title: {boost: 1},
    *     body: {boost: 0}
    *   }
    * }
    *
    * then, user could search with configuration to do query-time boosting.
    * idx.search('oracle database', {fields: {title: {boost: 2}, body: {boost: 1}}});
    * 
    * 
    * @constructor
    * 
    * @param {String} config user configuration
    * @param {Array} fields fields of index instance
    * @module
    */
  constructor(config: string, fields: any[]) {
    config = config || '';

    if (fields == undefined || fields == null) {
      throw new Error('fields should not be null');
    }

    this.config = {} as Config;

    var userConfig;
    try {
      userConfig = JSON.parse(config);
      this.buildUserConfig(userConfig, fields);
    } catch (error) {
      utils.warn('user configuration parse failed, will use default configuration');
      this.buildDefaultConfig(fields);
    }
  }

  /**
   * Build default search configuration.
   * 
   * @param {string[]} fields fields of index instance
   */
  buildDefaultConfig(fields: string[]) {
    this.reset();
    fields.forEach(function (field) {
      this.config[field] = {
        boost: 1,
        bool: 'OR',
        expand: false
      };
    }, this);
  }

  /**
   * Build user configuration.
   * 
   * @param {JSON} config User JSON configuratoin
   * @param {string[]} fields fields of index instance
   */
  buildUserConfig(config: Config, fields: string[]) {
    let global_bool: BoolTypes = 'OR';
    let global_expand = false;

    this.reset();
    if ('bool' in config) {
      global_bool = config['bool'] || global_bool;
    }

    if ('expand' in config) {
      global_expand = config['expand'] || global_expand;
    }

    if ('fields' in config) {
      for (var field in config['fields']) {
        if (fields.indexOf(field) > -1) {
          var field_config = config['fields'][field];
          var field_expand = global_expand;
          if (field_config.expand != undefined) {
            field_expand = field_config.expand;
          }

          this.config[field] = {
            boost: (field_config.boost || field_config.boost === 0) ? field_config.boost : 1,
            bool: field_config.bool || global_bool,
            expand: field_expand
          };
        } else {
          utils.warn('field name in user configuration not found in index instance fields');
        }
      }
    } else {
      this.addAllFields2UserConfig(global_bool, global_expand, fields);
    }
  }

  /**
   * Add all fields to user search configuration.
   * 
   * @param {string} bool Boolean model
   * @param {boolean} expand Expand model
   * @param {Array} fields fields of index instance
   */
  addAllFields2UserConfig(bool: BoolTypes, expand: boolean, fields: string[]) {
    fields.forEach(function (field) {
      this.config[field] = {
        boost: 1,
        bool: bool,
        expand: expand
      };
    }, this);
  }

  /**
   * get current user configuration
   */
  get() {
    return this.config;
  };

  /**
   * reset user search configuration.
   */
  reset() {
    this.config = {} as Config;
  };

}







